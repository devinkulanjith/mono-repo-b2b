import React, { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader, Tabs, Tab } from 'vtex.styleguide'

import './styles.global.css'
import AddMapPoint from './Componentes/AddMapPoint'
import MapPointData from './Componentes/MapPointData'

const AdminExample: FC = () => {
  const [selectedTab, setSelectedTab] = useState(2)

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-example.hello-world" />}
        />
      }
    >
      <PageBlock variation="full">
        <Tabs>
          <Tab
            label="Add a point"
            active={selectedTab === 1}
            onClick={() => setSelectedTab(1)}
          >
            <AddMapPoint />
          </Tab>
          <Tab
            label="Map Points"
            active={selectedTab === 2}
            onClick={() => setSelectedTab(2)}
          >
            <MapPointData />
          </Tab>
          {/* <UsersTable /> */}
        </Tabs>
      </PageBlock>
    </Layout>
  )
}

export default AdminExample
