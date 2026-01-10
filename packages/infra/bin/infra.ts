#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { CertificateStack } from '../lib/certificate-stack';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();

const domainName = app.node.tryGetContext('domainName');
if (!domainName) {
  throw new Error('Please provide "domainName" via context, e.g., -c domainName=bingo.sturrock.org');
}

const account = process.env.CDK_DEFAULT_ACCOUNT || app.node.tryGetContext('account');
const region = process.env.CDK_DEFAULT_REGION || app.node.tryGetContext('region');
const certRegion = app.node.tryGetContext('certRegion') || 'us-east-1';

new CertificateStack(app, 'BingoCertificateStack', {
  env: { account, region: certRegion },
  domainName,
});

new InfraStack(app, 'BingoInfraStack', {
  env: { account, region },
  domainName,
});