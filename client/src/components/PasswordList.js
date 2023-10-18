import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import PasswordForm from "./PasswordForm";

const handleClick = (e) => {
  e.preventDefault();
  console.log("click", e);
};

function PasswordList() {
  return (
    <Container>
      <PasswordForm />
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Password</th>
            <th>URL</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>gag@gmail.com</td>
            <td>password123</td>
            <td>www.testsite.co.nz</td>
            <td>This is a test password</td>
          </tr>
          <tr>
            <td>2</td>
            <td>gag1@gmail.com</td>
            <td>password123</td>
            <td>www.testsite.co.nz</td>
            <td>This is a test password</td>
          </tr>
          <tr>
            <td>3</td>
            <td>gag2@gmail.com</td>
            <td>password123</td>
            <td>www.testsite.co.nz</td>
            <td>This is a test password</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default PasswordList;
