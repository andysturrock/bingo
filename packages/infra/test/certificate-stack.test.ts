import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CertificateStack } from '../lib/certificate-stack';

test('CertificateStack creates expected resources', () => {
  const app = new cdk.App();
  const stack = new CertificateStack(app, 'TestCertStack', {
    domainName: 'test.example.com',
    env: { account: '123456789012', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Route53::HostedZone', {
    Name: 'test.example.com.'
  });

  template.hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'test.example.com'
  });

  // Check for SSM parameters
  template.hasResourceProperties('AWS::SSM::Parameter', {
    Name: '/bingo/test.example.com/hosted-zone-id'
  });
  template.hasResourceProperties('AWS::SSM::Parameter', {
    Name: '/bingo/test.example.com/certificate-arn'
  });
});
