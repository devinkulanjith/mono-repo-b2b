import { IOClients } from '@vtex/api'

import Status from './status'
import { BookClient } from './book'
import { MarkdownClient } from './markdown'
import { SapClient } from './simulation/sap'
import { JdeClient } from './simulation/jde'
import { Checkout } from './checkout'
import { CheckoutAdmin } from './checkoutAdmin'
import { Logistics } from './logistics'
import { Catalog } from './catalog'
import { TaxProvider } from './taxProvider'
import { CatalogJanusClient } from './catalogJanus'
import { OMS } from './oms'
import { SearchGraphQL } from './searchGraphQL'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get status() {
    return this.getOrSet('status', Status)
  }

  public get book() {
    return this.getOrSet('book', BookClient)
  }

  public get markdown() {
    return this.getOrSet('markdown', MarkdownClient)
  }

  public get sap() {
    return this.getOrSet('sap', SapClient)
  }

  public get jde() {
    return this.getOrSet('jde', JdeClient)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get checkoutAdmin() {
    return this.getOrSet('checkout', CheckoutAdmin)
  }

  public get logistics() {
    return this.getOrSet('logistics', Logistics)
  }

  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get catalogJanus() {
    return this.getOrSet('catalogJanus', CatalogJanusClient)
  }

  public get taxProvider() {
    return this.getOrSet('taxProvider', TaxProvider)
  }

  public get oms() {
    return this.getOrSet('oms', OMS)
  }

  public get searchGraphQL() {
    return this.getOrSet('searchGraphQL', SearchGraphQL)
  }
}
