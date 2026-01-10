import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as sdk_ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface CertificateStackProps extends cdk.StackProps {
  domainName: string;
}

export class CertificateStack extends cdk.Stack {
  public readonly certificate: acm.ICertificate;
  public readonly hostedZone: route53.IHostedZone;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: props.domainName,
    });

    this.certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(this.hostedZone),
    });

    // SSM Parameters for cross-region lookup
    new sdk_ssm.StringParameter(this, 'CertificateArnParam', {
      parameterName: `/bingo/${props.domainName}/certificate-arn`,
      stringValue: this.certificate.certificateArn,
    });

    new sdk_ssm.StringParameter(this, 'HostedZoneIdParam', {
      parameterName: `/bingo/${props.domainName}/hosted-zone-id`,
      stringValue: this.hostedZone.hostedZoneId,
    });
  }
}
