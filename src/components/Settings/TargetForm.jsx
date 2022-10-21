import React from 'react'
import { Button, Form, Select, Input, Progress } from "antd";
import { useState } from 'react';

const TargetForm = () => {
  const [targets, setTargets] = useState([{course: "AIML", target: 60 }])

  const submitNewTarget = () => {
    console.log("Submit")
  }
  
  return (
    <div>
        You can set targets for each course here.
        <Form >
          <Form.Item label="Course" name="course">
            <Select>
              <Select.Option value="AIML">AIML</Select.Option>
              <Select.Option value="MAI">MAI</Select.Option>
              <Select.Option value="MAC">MAC</Select.Option>
              <Select.Option value="MCS">MCS</Select.Option>
              <Select.Option value="MCSS">MCSS</Select.Option>
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
            <Button onClick={submitNewTarget}> Submit</Button>
          </Form.Item>
        </Form>
        <div>
          <>
          Current Targets:
          {
            targets.map(target => {return (
              <div>
                <h3>{target.course}</h3>
                <Progress percent={target.target} status="active" />
              </div>
            )})
          }
          </>
        </div>
      </div>
  )
}

export default TargetForm