import React from 'react'
import { Input } from 'vtex.styleguide'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-apollo'

import CREATE_DOCUMENT from '../query/create.graphql'

type FormValues = {
  pointName: string
  phoneNumber: string
  brand: string
  website: string
  address: string
  zipcode: string
  country: string
  lng: string
  lat: string
  email: string
  pointType: string
}

const AddMapPoint = () => {
  const { register, handleSubmit } = useForm<FormValues>()
  const [createDocument] = useMutation(CREATE_DOCUMENT)

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const point = {
      pointName: data.pointName,
      phoneNumber: data.phoneNumber,
      brand: data.brand,
      website: data.website,
      address: data.address,
      zipcode: data.zipcode,
      country: data.country,
      lng: parseFloat(data.lng),
      lat: parseFloat(data.lat),
      email: data.email,
      pointType: data.pointType,
    }
    // eslint-disable-next-line no-console
    console.log(point)

    // eslint-disable-next-line vtex/prefer-early-return

    const response = await createDocument({
      variables: {
        mapPoint: point,
      },
    })
    // eslint-disable-next-line no-console
    console.log('Responce : ', response)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'block' }}>
        <div>
          <Input label="Map Point Name" {...register('pointName')} />
        </div>
        <div>
          <Input label="Phone Number" {...register('phoneNumber')} />
        </div>
        <div>
          <Input label="Brand" {...register('brand')} />
        </div>
        <div>
          <Input label="Website" {...register('website')} />
        </div>
        <div>
          <Input label="Address" {...register('address')} />
        </div>
        <div>
          <Input label="Zipcode" {...register('zipcode')} />
        </div>
        <div>
          <Input label="Country" {...register('country')} />
        </div>
        <div>
          <Input label="E-mail" {...register('email')} />
        </div>
        <div>
          <Input label="Point Type" {...register('pointType')} />
        </div>
        <div>
          <Input
            type="number"
            step="0.0001"
            label="Longitude"
            {...register('lng')}
          />
        </div>
        <div>
          <Input
            type="number"
            step="0.0001"
            label="Latitude"
            {...register('lat')}
          />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
    </div>
  )
}

export default AddMapPoint


