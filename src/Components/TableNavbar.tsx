import React, { useState } from 'react';
import { Menu, Dropdown, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const TableNavbar: React.FC = () => {
  const [manager, setManager] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const managerMenu = (
    <Menu onClick={({ key }) => setManager(key)}>
      <Menu.Item key="vikash">Vikash</Menu.Item>
      <Menu.Item key="tom">Tom</Menu.Item>
      <Menu.Item key="jerry">Jerry</Menu.Item>
      <Menu.Item key="trump">Trump</Menu.Item>
    </Menu>
  );
const teamLeadMenu = (
    <Menu onClick={({ key }) => setTeamLead(key)}>
      <Menu.Item key="ajay">Ajay</Menu.Item>
      <Menu.Item key="suresh">Suresh</Menu.Item>
      <Menu.Item key="ramesh">Ramesh</Menu.Item>
    </Menu>
  );

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setDate(date);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',width:'85vw', marginTop:'7%' }}>
      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', width:'100%' }}>
        <Dropdown overlay={managerMenu}>
          <Button  className='nav-dropDown'  style={{width:'120px'}}>Manager: {manager}</Button>
        </Dropdown>
        <Dropdown overlay={teamLeadMenu}>
          <Button    className='nav-dropDown' style={{ paddingInline:'10px'  }}>Team Lead: {teamLead}</Button>
        </Dropdown>
        <Button type="primary" className='go-btn' style={{width:'50px', paddingInline:'10px'}}>
          Go
        </Button>

      {/* <div> */}
        <DatePicker value={date} className='nav-date' style={{background: '#FFFFFF',
border: '1px solid #BEBEBE',
borderRadius: '99px', width:'120px'}}  onChange={handleDateChange} />
        <Button  className='nav-proj-btn' type="primary" style={{ marginLeft: 8 }}>
          Add Project
        </Button>
        <span className='nav-hrs-estimate'> upwork hours : 355 hrs</span>
      {/* </div> */}
    </div>
    </div>
  );
};

export default TableNavbar;
