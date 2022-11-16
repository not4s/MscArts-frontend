import React, { useEffect } from 'react'
import { Button, Form, Select, Input, Progress, Spin } from "antd";
import { useState } from 'react';
import { APIService } from '../../services/API';
import { ApiOutlined } from '@ant-design/icons';

const TargetForm = () => {
  const [targets, setTargets] = useState([])
  const [loaded, setLoaded] = useState(false)
  const programs = ["AIML", "MAI", "MAC", "MCS", "MCSS"]
  const api = new APIService();

  const submitNewTarget = (values) => {
    api.postTarget(values)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err))
  }

  const handleRemove = (e, course, year) => {
    e.preventDefault();

    api.deleteTarget({ course, year })
      .then(res => api.getTargets()
        .then(res => { console.log(res.data); setTargets(res.data); setLoaded(true) })
        .catch(err => console.log(err)))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    api.getTargets()
      .then(res => { console.log(res.data); setTargets(res.data); setLoaded(true) })
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
        You can set targets for each course here. 
        <Form 
        name="targets"
        labelCol={{span: 2}}
        onFinish={submitNewTarget}
        >
          <Form.Item  name="course" style={{width:240}} rules={[{required:true}]}>
            <Select placeholder="Course"> 
              {
                programs.map(program => {return(
                  <Select.Option value={program}>
                    {program}
                  </Select.Option>
                )})
              }
            </Select>
          </Form.Item>
          <Form.Item  name="year" style={{width:240}} rules={[{required:true}]}>
            <Select placeholder="Year">
              <Select.Option value="2023">22/23</Select.Option>
              <Select.Option value="2022">21/22</Select.Option>
              <Select.Option value="2021">20/21</Select.Option>
              <Select.Option value="2020">19/20</Select.Option>
              <Select.Option value="2019">18/19</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="feeStatus" style={{width:240}} rules={[{required:true}]} >
            <Select placeholder="Fee Status">
              <Select.Option value="Overseas">Overseas</Select.Option>
              <Select.Option value="Home">Home</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item  name="target" style={{width:240}} rules={[{required:true}]}>
            <Input placeholder="Target"/>
          </Form.Item>
       
          <Form.Item>
            <Button htmlType='submit'>Submit new target</Button>
          </Form.Item>
        </Form>
      <div>
        <>
          {
            !loaded ?
              <Spin size="large" />
              :
              <>
                Current Targets:
                {
                  targets.map(target => {
                    return (
                      <div>
                        <h3>{target.program_type} ({target.year}) ({target.fee_status})</h3>
                        <Button onClick={e => handleRemove(e, target.program_type, target.year)}>Remove</Button>
                        <Progress percent={100 * target.progress / target.target} status="active" />
                      </div>
                    )
                  })}
              </>
          }
        </>
      </div>
    </div>
  )
}

export default TargetForm