import { Button, Form, Input, Modal } from "antd";
import { APIService } from "../services/API";

export default function ProgramDeleteModal(props: any) {
  const api = new APIService();

  return (
    <Modal
      open={props.open}
      onCancel={() => props.setOpen(false)}
      onOk={() => {
        api.programDelete(props.code).then(props.setOpen(false));
      }}
    >
      Do you wish to delete this program?
    </Modal>
  );
}
