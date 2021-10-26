import * as cdk from '@aws-cdk/core';

import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';

export class CdkStepStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vulFormulier = new lambda.Function(this, 'VulFormulierFunction', {
      code: lambda.Code.fromInline(`
          exports.handler = (event, context, callback) => {
              logger.debug('in VulFormulierFunction');
              callback(null, "Hello World!");
          };
      `),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      timeout: cdk.Duration.seconds(3)
    });

    const stateMachine = new sfn.StateMachine(this, 'MyStateMachine', {
      definition: new tasks.LambdaInvoke(this, "VulFormulierTask", {
        lambdaFunction: vulFormulier
      }).next(new sfn.Succeed(this, "GreetedWorld"))
    });
  }
}
