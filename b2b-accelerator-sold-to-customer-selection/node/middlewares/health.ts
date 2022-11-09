export async function health(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: { logger },
  } = ctx

  // The schuduler "checkout-simulation-health-check" will be using
  // this end-point to ensure that this service is up and running.
  logger.info('Checkout simulation service is up and running.')

  ctx.status = 200
  ctx.set('Cache-Control', 'No-Cache')

  await next()
}
