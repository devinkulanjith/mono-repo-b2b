import type { JdeOrderResponse } from '../../typings/jde'

export const mockJdeSuccess: JdeOrderResponse = {
  OrderNumber: '1048092',
  currency: 'USD',
  globalErrors: '',
  soldToCustomerNumber: '1234456',
  shipToCustomerNumber: '35780436',
  requestedDeliveryDate: '03/14/2022',
  customerPO: '1245',
  items: [
    {
      itemLine: '1',
      ProductRefId: '76003-05200',
      Description: 'STEM COLLECTOR',
      ExtendedAmount: '79.08',
      UnitPrice: '6.59',
      baseUnitOfMeasure: 'EA',
      quantity: '12',
      itemReqDeliveryDate: '03/14/2022',
      DeliveryDate: '03/14/2022',
      UnitsOfMeasure: 'EA',
      Lot_Number: '',
      Print_Message: '',
    },
    {
      itemLine: '2',
      ProductRefId: '76003-05200',
      Description: 'STEM COLLECTOR',
      ExtendedAmount: '85.67',
      UnitPrice: '6.59',
      baseUnitOfMeasure: 'EA',
      quantity: '13',
      DeliveryDate: '03/14/2022',
      itemReqDeliveryDate: '03/14/2022',
      UnitsOfMeasure: 'EA',
      Lot_Number: '',
      Print_Message: '',
    },
  ],
}

export const mockJdeGlobalError: JdeOrderResponse = {
  OrderNumber: '1048092',
  currency: 'USD',
  soldToCustomerNumber: '1234456',
  shipToCustomerNumber: '35780436',
  requestedDeliveryDate: '03/14/2022',
  customerPO: '1245',
  globalErrors: ['Global error 1', 'Global error 2'],
  items: [
    {
      itemLine: '1',
      ProductRefId: '76003-05200',
      Description: 'STEM COLLECTOR',
      ExtendedAmount: '79.08',
      UnitPrice: '6.59',
      baseUnitOfMeasure: 'EA',
      quantity: '12',
      itemReqDeliveryDate: '03/14/2022',
      DeliveryDate: '03/14/2022',
      UnitsOfMeasure: 'EA',
      Lot_Number: '',
      Print_Message: '',
    },
    {
      itemLine: '2',
      ProductRefId: '76003-05200',
      Description: 'STEM COLLECTOR',
      ExtendedAmount: '85.67',
      UnitPrice: '6.59',
      baseUnitOfMeasure: 'EA',
      quantity: '13',
      itemReqDeliveryDate: '03/14/2022',
      DeliveryDate: '03/14/2022',
      UnitsOfMeasure: 'EA',
      Lot_Number: '',
      Print_Message: '',
    },
  ],
}

export const mockJdeLineItemError: JdeOrderResponse = {
  OrderNumber: '1048092',
  currency: 'EUR',
  globalErrors: '',
  soldToCustomerNumber: '1234456',
  shipToCustomerNumber: '35780436',
  requestedDeliveryDate: '03/14/2022',
  customerPO: '1245',
  items: [
    {
      itemLine: '1',
      ProductRefId: '76003-05200',
      Description: 'STEM COLLECTOR',
      ExtendedAmount: '79.08',
      UnitPrice: '6.59',
      baseUnitOfMeasure: 'EA',
      quantity: '12',
      itemReqDeliveryDate: '03/14/2022',
      DeliveryDate: '03/14/2022',
      UnitsOfMeasure: 'EA',
      lineItemErrors: [
        'Line item error 1 - product 1',
        'Line item error 2 - product 1',
      ],
      Lot_Number: '',
      Print_Message: '',
    },
    {
      itemLine: '2',
      ProductRefId: '76003-05200',
      Description: 'STEM COLLECTOR',
      ExtendedAmount: '85.67',
      UnitPrice: '6.59',
      baseUnitOfMeasure: 'EA',
      quantity: '13',
      itemReqDeliveryDate: '03/14/2022',
      DeliveryDate: '03/14/2022',
      UnitsOfMeasure: 'EA',
      lineItemErrors: ['Line item error 1 - product 2'],
      Lot_Number: '',
      Print_Message: '',
    },
  ],
}

export const mockJdeLineItemWarning: JdeOrderResponse = {
  OrderNumber: '1048092',
  currency: 'USD',
  globalErrors: '',
  soldToCustomerNumber: '1234456',
  shipToCustomerNumber: '35780436',
  requestedDeliveryDate: '03/14/2022',
  customerPO: '1245',
  items: [
    {
      itemLine: '1',
      ProductRefId: '76003-05200',
      Description: 'STEM COLLECTOR',
      ExtendedAmount: '79.08',
      UnitPrice: '6.59',
      baseUnitOfMeasure: 'EA',
      quantity: '12',
      itemReqDeliveryDate: '03/14/2022',
      DeliveryDate: '03/14/2022',
      UnitsOfMeasure: 'EA',
      lineItemWarnings: [
        'Line item warning 1 - product 1',
        'Line item warning 2 - product 1',
      ],
      Lot_Number: '',
      Print_Message: '',
    },
    {
      itemLine: '2',
      ProductRefId: '76003-05200',
      Description: 'STEM COLLECTOR',
      ExtendedAmount: '85.67',
      UnitPrice: '6.59',
      baseUnitOfMeasure: 'EA',
      quantity: '13',
      itemReqDeliveryDate: '03/14/2022',
      DeliveryDate: '03/14/2022',
      UnitsOfMeasure: 'EA',
      Lot_Number: '',
      Print_Message: '',
    },
  ],
}
