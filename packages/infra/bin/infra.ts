#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { CertificateStack } from '../lib/certificate-stack';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();

const domainName = app.node.tryGetContext('domainName');
if (!domainName) {
  throw new Error('Please provide "domainName" via context, e.g., -c domainName=DOMAIN_NAME_PLACEHOLDER');
}

new CertificateStack(app, 'BingoCertificateStack', {
  env: { account: 'AWS_ACCOUNT_ID_PLACEHOLDER', region: 'us-east-1' },
  domainName,
});

new InfraStack(app, 'BingoInfraStack', {
  env: { account: 'AWS_ACCOUNT_ID_PLACEHOLDER', region: 'eu-west-2' },
  domainName,
});