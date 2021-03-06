import styled from 'styled-components';
import { Button, Form } from 'react-bootstrap';
import { MdStar, MdStarBorder, MdDeleteForever } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';

export const VideosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 307px;
`;

export const Open = styled(MdStar)`
  position: absolute;
  right: 5px;
  top: 5px;
  color: ${({ open }) => (open ? 'rgb(255,255,0)' : 'rgb(200,200,200)')};
  transform: ${({ open }) => (open ? 'scale(1.2)' : 'unset')};
  z-index: 4;
  cursor: pointer;
  transition: color 250ms, transform 250ms;

  &:hover {
    /* color: green; */
    color: rgb(255, 255, 0);
    transform: scale(1.2);
  }
`;

export const Close = styled(IoIosCloseCircleOutline)`
  position: absolute;
  right: 6px;
  top: 6px;
  color: ${({ open }) => (open ? '#ffffff' : 'rgb(200,200,200)')};
  transform: ${({ open }) => (open ? 'scale(1.2)' : 'unset')};
  z-index: 4;
  cursor: pointer;
  transition: color 250ms, transform 250ms;

  &:hover {
    /* color: red; */
    color: #ffffff;
    transform: scale(1.2);
  }
`;

export const Lists = styled.div`
  /* background: var(--navigationbarBackground); */
  background: rgba(20, 20, 20, 0.92);
  padding: 7px;
  border-radius: 5px;
  box-shadow: -3px 3px 5px black;
`;

export const ListItem = styled.div`
  height: 30px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  box-shadow: 0px 1px 2px #2f2c37;
  display: flex;
  align-items: center;

  &:last-child {
    box-shadow: none;
  }

  color: rgb(200, 200, 200);

  &:hover {
    color: #ffffff;
  }

  svg {
    cursor: pointer;
  }
`;

export const ListsLink = styled.div`
  display: flex;
  justify-content: center;
  height: 23px;

  a {
    color: rgb(200, 200, 200);
    font-weight: 600;
    font-size: 14px;
    align-items: center;
    width: max-content;

    &:hover {
      color: #ffffff;
    }
  }
`;

export const FormButton = styled(Button)`
  padding: 2px;
  display: flex;
  grid-area: btn;
  height: max-content;
  margin-top: 10px;
  grid-area: btn;
`;

export const FormGroup = styled(Form.Group)`
  margin-bottom: 0px;
  display: grid;
  grid-template-areas: 'input btn';
  grid-template-columns: auto;
`;

export const ButtonContainer = styled.div`
  opacity: ${({ open }) => (open ? '1' : '0')};
  transition: opacity 250ms;
  transition-delay: 250ms;

  min-width: 200px;
  width: max-content;
  right: 0px;
  position: absolute;
  /* top: 0; */
  z-index: 3;

  &:focus-within,
  &:focus,
  &:hover {
    opacity: 1;
    transition-delay: 0ms;
  }
`;

export const AddItemBtn = styled(MdStarBorder)`
  margin-left: 7px;
  transition: color 250ms;
  cursor: pointer;

  &:hover {
    color: rgb(255, 255, 0);
  }
`;

export const RemoveItemBtn = styled(MdStar)`
  margin-left: 7px;
  color: rgb(255, 255, 0);
  transition: color 250ms;
  cursor: pointer;

  &:hover {
    color: rgb(100, 100, 100);
  }
`;

export const DeleteListButton = styled(MdDeleteForever)`
  color: rgb(150, 150, 150);
  opacity: 0.5;
  transition: color 250ms, opacity 250ms;
  cursor: pointer;

  &:hover {
    color: rgb(150, 000, 000);
    opacity: 1;
  }
`;

export const Label = styled(Form.Label)`
  input {
    margin-top: 5px;
    padding: 7px;
    background: #0000004f;
    color: rgb(200, 200, 200);
    border-top: none;
    border-right: none;
    border-left: none;
  }
`;
