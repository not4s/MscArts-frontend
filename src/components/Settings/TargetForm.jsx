import React, { useEffect } from 'react'
import { Button, Form, Select, Input, Progress, Spin } from "antd";
import { useState } from 'react';
import { APIService } from '../../services/API';
import { ApiOutlined } from '@ant-design/icons';

const TargetForm = () => {
  const [targets, setTargets] = useState([])
  const [programs, setPrograms] = useState([])
  const api = new APIService();

  const submitNewTarget = (values) => {
    api.postTarget(values)
      .then(res => {
        if (res.data.message == "Exists") {
          api.putTarget(values)
          .then(res => console.log(res.data))
          .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    api.getPrograms()
      .then(res => {console.log(res.data); setPrograms(res.data)})
      .catch(err => console.log(err))
    api.getTargets()
      .then(res => {console.log(res.data); setTargets(res.data)})
      .catch(err => console.log(err))
  }, [])
  
  return (
    <div>
        You can set targets for each course here.
        <Form 
        name="targets"
        onFinish={submitNewTarget}
        >
          <Form.Item label="Course" name="course">
            <Select>
              {
                programs.map(program => {return(
                  <Select.Option value={program.code}>
                    {program.name}
                  </Select.Option>
                )})
              }
            </Select>
          </Form.Item>
          <Form.Item label="Target" name="target">
            <Input />
          </Form.Item>
          <Form.Item label="Year" name="year">
            <Select>
              <Select.Option value="2023">22/23</Select.Option>
              <Select.Option value="2022">21/22</Select.Option>
              <Select.Option value="2021">20/21</Select.Option>
              <Select.Option value="2020">19/20</Select.Option>
              <Select.Option value="2019">18/19</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit'> Submit</Button>
          </Form.Item>
        </Form>
        <div>
          <>
          {
            targets.length == 0 ? 
            <Spin size="large"/>
            :
            <>
              Current Targets:
              {
              targets.map(target => {return (
                <div>
                  <h3>{target.program_type}</h3>
                  <Progress percent={target.target} status="active" />
                </div>
              )})}
            </>
          }
          </>
        </div>
      </div>
  )
}

export default TargetForm