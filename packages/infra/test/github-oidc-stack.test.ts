import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { GitHubOidcStack } from '../lib/github-oidc-stack';

test('GitHubOidcStack creates expected resources', () => {
  const app = new cdk.App();
  const stack = new GitHubOidcStack(app, 'TestOidcStack', {
    env: { account: '123456789012', region: 'eu-west-2' }
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
    Url: 'https://token.actions.githubusercontent.com',
    ClientIDList: ['sts.amazonaws.com']
  });

  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRoleWithWebIdentity',
          Effect: 'Allow',
          Principal: {
            Federated: { "Ref": "GitHubProviderDD1D07DF" }
          },
          Condition: {
            StringLike: {
              'token.actions.githubusercontent.com:sub': 'repo:andysturrock/bingo:*'
            },
            StringEquals: {
              'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'
            }
          }
        }
      ]
    }
  });
});
