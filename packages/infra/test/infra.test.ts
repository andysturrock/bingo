import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfraStack } from '../lib/infra-stack';

test('InfraStack creates expected resources', () => {
  const app = new cdk.App();
  const stack = new InfraStack(app, 'TestInfraStack', {
    domainName: 'test.example.com',
    env: { account: '123456789012', region: 'eu-west-2' }
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true
    }
  });

  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Aliases: ['test.example.com'],
      DefaultRootObject: 'index.html'
    }
  });

  template.resourceCountIs('AWS::Route53::RecordSet', 2); // A and AAAA
});
