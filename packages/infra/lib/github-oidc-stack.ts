import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class GitHubOidcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const provider = new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });

    const deployRole = new iam.Role(this, 'GitHubDeployRole', {
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringLike: {
          'token.actions.githubusercontent.com:sub': 'repo:andysturrock/bingo:*',
        },
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
      }),
      description: 'Role assumed by GitHub Actions for deployment',
    });

    deployRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    new cdk.CfnOutput(this, 'RoleArn', {
      value: deployRole.roleArn,
    });
  }
}
