import React, { Component } from 'react';
import { DataTable } from 'react-native-paper'
import { View, Text } from 'react-native';

export default class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title >Type</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>1043</DataTable.Cell>
          <DataTable.Cell>Surficial Monitoring</DataTable.Cell>
          <DataTable.Cell>06-14-2018</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>1043</DataTable.Cell>
          <DataTable.Cell>Rainfall Graphs</DataTable.Cell>
          <DataTable.Cell>06-14-2018</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>1043</DataTable.Cell>
          <DataTable.Cell>Subsurface Graphs</DataTable.Cell>
          <DataTable.Cell>06-14-2018</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>1043</DataTable.Cell>
          <DataTable.Cell>Sensor Status</DataTable.Cell>
          <DataTable.Cell>06-14-2018</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>1043</DataTable.Cell>
          <DataTable.Cell>Situation Report</DataTable.Cell>
          <DataTable.Cell>06-14-2018</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Pagination
          page={1}
          numberOfPages={3}
          onPageChange={(page) => { console.log(page); }}
          label="1-2 of 6"
        />
      </DataTable>
    );
  }
}
