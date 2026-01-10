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

new CertificateStack(app, 'BingoCertificateStack', {
  env: { account: '636099490084', region: 'us-east-1' },
  domainName,
});

new InfraStack(app, 'BingoInfraStack', {
  env: { account: '636099490084', region: 'eu-west-2' },
  domainName,
});