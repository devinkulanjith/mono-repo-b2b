import type {
  InstanceOptions,
  IOContext,
  IOResponse,
  RequestConfig,
} from '@vtex/api'
import { JanusClient } from '@vtex/api'

import { checkoutCookieFormat, statusToError } from '../../utils'
import type {
  CheckoutClientPreferencesData,
  CheckoutProfile,
  OpenTextField,
  OrderForm,
  OrderFormItemInput,
  PaymentDataInput,
  UserProfileInput,
} from '../../typings/orderForm'

export interface SimulationData {
  country: string
  items: Array<{ id: string; quantity: number | string; seller: string }>
  postalCode?: string
  isCheckedIn?: boolean
  priceTables?: string[]
  marketingData?: Record<string, string>
}

export class Checkout extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
      },
    })
  }

  public updateOrderFormShipping = (orderFormId: string, shipping: any) =>
    this.post<OrderForm>(
      this.routes.attachmentsData(orderFormId, 'shippingData'),
      shipping,
      { metric: 'checkout-simulate-updateOrderFormShipping' }
    )

  public updateOrderFormPayment = (
    orderFormId: string,
    paymentData: PaymentDataInput
  ) =>
    this.post<OrderForm>(
      this.routes.attachmentsData(orderFormId, 'paymentData'),
      paymentData,
      { metric: 'checkout-simulate-updateOrderFormPayment' }
    )

  public setOrderFormCustomData = (
    orderFormId: string,
    appId: string,
    field: string,
    value: any
  ) =>
    this.put<OrderForm>(
      this.routes.orderFormCustomData(orderFormId, appId, field),
      { value },
      { metric: 'checkout-simulate-setOrderFormCustomData' }
    )

  public removeOrderFormCustomData = (
    orderFormId: string,
    appId: string,
    field: string
  ) =>
    this.delete<OrderForm>(
      this.routes.orderFormCustomData(orderFormId, appId, field),
      { metric: 'checkout-simulate-removeOrderFormCustomData' }
    )

  public setOrderFormMultipleCustomData = (
    orderFormId: string,
    appId: string,
    field: any
  ) =>
    this.put<OrderForm>(
      this.routes.orderFormMultiCustomData(orderFormId, appId),
      field,
      { metric: 'checkout-simulate-setOrderFormMultiCustomData' }
    )

  public changeItemPrice = (
    orderFormId: string,
    itemIndex: number,
    price: number,
    salesChannel?: string
  ) =>
    this.put<OrderForm>(
      this.routes.changePrice(orderFormId, itemIndex, salesChannel),
      { price },
      {
        metric: 'checkout-simulate-changeItemPrice',
        headers: {
          ...this.options?.headers,
          VtexIdclientAutCookie: this.context.authToken,
        },
      }
    )

  public updateItems = (
    orderFormId: string,
    orderItems: Array<Omit<OrderFormItemInput, 'id'>>,
    splitItem: boolean,
    allowedOutdatedData?: string[]
  ) =>
    this.post<OrderForm>(
      this.routes.updateItems(
        orderFormId,
        this.getChannelQueryString(undefined)
      ),
      {
        orderItems,
        noSplitItem: !splitItem,
        allowedOutdatedData,
      },
      { metric: 'checkout-updateItems' }
    )

  public updateOrderFormIgnoreProfile = (
    orderFormId: string,
    ignoreProfileData: boolean
  ) =>
    this.patch(
      this.routes.orderFormProfile(orderFormId),
      { ignoreProfileData },
      { metric: 'checkout-updateOrderFormIgnoreProfile' }
    )

  public updateOrderFormProfile = (
    orderFormId: string,
    fields: UserProfileInput
  ) =>
    this.post<OrderForm>(
      this.routes.attachmentsData(orderFormId, 'clientProfileData'),
      fields,
      { metric: 'checkout-updateOrderFormProfile' }
    )

  public updateOrderFormClientPreferencesData = (
    orderFormId: string,
    preferencesData: CheckoutClientPreferencesData
  ) =>
    this.post<OrderForm>(
      this.routes.attachmentsData(orderFormId, 'clientPreferencesData'),
      preferencesData,
      { metric: 'checkout-updateOrderFormClientPreferencesData' }
    )

  public updateOrderFromOpenTextField = (
    orderFromId: string,
    openTextField: OpenTextField
  ) =>
    this.post<OrderForm>(
      this.routes.attachmentsData(orderFromId, 'openTextField'),
      openTextField,
      { metric: 'checkout-updateOrderFromOpenTextField' }
    )

  public addAssemblyOptions = async (
    orderFormId: string,
    itemId: string | number,
    assemblyOptionsId: string,
    body: any
  ) =>
    this.post(
      this.routes.assemblyOptions(orderFormId, itemId, assemblyOptionsId),
      body,
      { metric: 'checkout-addAssemblyOptions' }
    )

  public removeAssemblyOptions = async (
    orderFormId: string,
    itemId: string | number,
    assemblyOptionsId: string,
    body: any
  ) =>
    this.delete(
      this.routes.assemblyOptions(orderFormId, itemId, assemblyOptionsId),
      { metric: 'checkout-removeAssemblyOptions', data: body }
    )

  public orderForm = (orderFormId: string, refreshOutdatedData = false) => {
    return this.post<OrderForm>(
      this.routes.orderForm(
        orderFormId,
        this.getOrderFormQueryString(refreshOutdatedData)
      ),
      {},
      { metric: 'checkout-orderForm' }
    )
  }

  public newOrderForm = (refreshOutdatedData = false) => {
    return this.postRawWithoutCommonHeaders<OrderForm>(
      this.routes.newOrderForm(
        this.getOrderFormQueryString(refreshOutdatedData)
      ),
      undefined,
      { metric: 'new-orderForm' }
    )
  }

  public orderFormRaw = (orderFormId?: string, refreshOutdatedData = false) => {
    return this.postRaw<OrderForm>(
      this.routes.orderForm(
        orderFormId,
        this.getOrderFormQueryString(refreshOutdatedData)
      ),
      {},
      { metric: 'checkout-orderForm' }
    )
  }

  public simulation = (simulation: SimulationData) =>
    this.post(
      this.routes.simulation(this.getChannelQueryString()),
      simulation,
      {
        metric: 'checkout-simulation',
      }
    )

  public insertCoupon = (orderFormId: string, coupon: string) =>
    this.post<OrderForm>(this.routes.insertCoupon(orderFormId), {
      text: coupon,
    })

  public updateProfile = (orderFormId: string, profile: UserProfileInput) =>
    this.post<OrderForm>(
      this.routes.attachmentsData(orderFormId, 'clientProfileData'),
      profile,
      {
        headers: {
          ...this.options?.headers,
          VtexIdclientAutCookie: this.context.authToken,
        },
      }
    )

  public getProfile = (email: string) =>
    this.get<CheckoutProfile>(this.routes.profile(email))

  public updateItemsOrdination = (
    orderFormId: string,
    ascending: boolean,
    criteria: string
  ) =>
    this.post<OrderForm>(
      this.routes.updateItemsOrdination(orderFormId),
      {
        ascending,
        criteria,
      },
      { metric: 'checkout-orderForm' }
    )

  public removeAllItems = (orderFormId: string) =>
    this.post<OrderForm>(
      this.routes.removeAllItems(orderFormId),
      {},
      { metric: 'simulation-checkout-removeAllItems' }
    )

  protected get = <T>(url: string, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(),
    }

    return this.http.get<T>(url, config).catch(statusToError) as Promise<T>
  }

  protected post = <T>(url: string, data?: any, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(),
    }

    return this.http
      .post<T>(url, data, config)
      .catch(statusToError) as Promise<T>
  }

  protected postRawWithoutCommonHeaders = <T>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    config.headers = {
      ...config.headers,
    }

    return this.http
      .postRaw<T>(url, data, config)
      .catch(statusToError) as Promise<IOResponse<T>>
  }

  protected postRaw = async <T>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(),
    }

    return this.http
      .postRaw<T>(url, data, config)
      .catch(statusToError) as Promise<IOResponse<T>>
  }

  protected delete = <T>(url: string, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(),
    }

    return this.http.delete<T>(url, config).catch(statusToError) as Promise<
      IOResponse<T>
    >
  }

  protected patch = <T>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(),
    }

    return this.http
      .patch<T>(url, data, config)
      .catch(statusToError) as Promise<T>
  }

  protected put = <T>(url: string, data?: any, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders(),
    }

    return this.http
      .put<T>(url, data, config)
      .catch(statusToError) as Promise<T>
  }

  private getCommonHeaders = () => {
    const { orderFormId } = this.context as unknown as CustomIOContext
    const checkoutCookie = orderFormId ? checkoutCookieFormat(orderFormId) : ''

    return {
      Cookie: `${checkoutCookie}vtex_segment=${this.context.segmentToken};vtex_session=${this.context.sessionToken};`,
    }
  }

  private getChannelQueryString = (salesChannel?: string) => {
    const { segment } = this.context as unknown as CustomIOContext
    const channel = salesChannel ?? segment?.channel
    const queryString = channel ? `?sc=${channel}` : ''

    return queryString
  }

  private getOrderFormQueryString = (refreshOutdatedData?: boolean) => {
    if (refreshOutdatedData) {
      return `?refreshOutdatedData=${refreshOutdatedData}`
    }

    return ''
  }

  private get routes() {
    const base = '/api/checkout/pub'

    return {
      addItem: (orderFormId: string, queryString: string) =>
        `${base}/orderForm/${orderFormId}/items${queryString}`,
      assemblyOptions: (
        orderFormId: string,
        itemId: string | number,
        assemblyOptionsId: string
      ) =>
        `${base}/orderForm/${orderFormId}/items/${itemId}/assemblyOptions/${encodeURI(
          assemblyOptionsId
        )}`,
      attachmentsData: (orderFormId: string, field: string) =>
        `${base}/orderForm/${orderFormId}/attachments/${field}`,
      cancelOrder: (orderFormId: string) =>
        `${base}/orders/${orderFormId}/user-cancel-request`,
      checkin: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/checkIn`,
      changePrice: (
        orderFormId: string,
        itemIndex: number,
        salesChannel?: string
      ) =>
        !salesChannel
          ? `${base}/orderForm/${orderFormId}/items/${itemIndex}/price`
          : `${base}/orderForm/${orderFormId}/items/${itemIndex}/price?sc=${salesChannel}`,
      clearMessages: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/messages/clear`,
      insertCoupon: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/coupons`,
      orderForm: (orderFormId?: string, queryString?: string) =>
        `${base}/orderForm/${orderFormId ?? ''}${queryString}`,
      newOrderForm: (queryString?: string) =>
        `${base}/orderForm/${queryString}`,
      orderFormCustomData: (
        orderFormId: string,
        appId: string,
        field: string
      ) => `${base}/orderForm/${orderFormId}/customData/${appId}/${field}`,
      orderFormMultiCustomData: (orderFormId: string, appId: string) =>
        `${base}/orderForm/${orderFormId}/customData/${appId}`,
      orders: `${base}/orders`,
      orderFormProfile: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/profile`,
      profile: (email: string) => `${base}/profiles/?email=${email}`,
      simulation: (queryString: string) =>
        `${base}/orderForms/simulation${queryString}`,
      updateItems: (orderFormId: string, queryString: string) =>
        `${base}/orderForm/${orderFormId}/items/update${queryString}`,
      offering: (orderFormId: string, itemIndex: number) =>
        `${base}/orderForm/${orderFormId}/items/${itemIndex}/offerings`,
      removeOffering: (
        orderFormId: string,
        itemIndex: number,
        offeringId: string
      ) =>
        `${base}/orderForm/${orderFormId}/items/${itemIndex}/offerings/${offeringId}/remove`,
      bundleItemAttachment: (
        orderFormId: string,
        itemIndex: number,
        bundleItemId: string,
        attachmentName: string
      ) =>
        `${base}/orderForm/${orderFormId}/items/${itemIndex}/bundles/${bundleItemId}/attachments/${attachmentName}`,
      savePaymentToken: (queryString: string) =>
        `${base}/current-user/payment-tokens/${queryString}`,
      getPaymentSession: () => `${base}/payment-session`,
      updateItemsOrdination: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/itemsOrdination`,
      removeAllItems: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/items/removeAll`,
    }
  }
}
