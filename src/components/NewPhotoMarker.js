import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import useWindowDimensions from '../hooks/useWindowDimensions'

const Point = styled.div`
position: absolute;
top: 50%;
left: 50%;
width: 30px;
height: 30px;
background: #fff;
cursor: pointer;
transform: translate(-50%, -120%) rotate(45deg);
z-index: 200

&:hover {
  z-index: 1;
}
`;


const NewPhotoMarker = ({ text, onClick, photo, photoName, username, date, i }) => {
  const { height, width } = useWindowDimensions();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fullscreen, setFullscreen] = useState(true);

  const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  background: url(${photo});
  background-size: 50px 50px;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -120%);
  cursor: pointer;
  z-index: 300
  &:hover {
    z-index: 1;
  }
`;




  useEffect(()=>{
  }, [])

  const desktopOverlay = () => {

    const style = {


    }

    return(
        <>
        <Point/>
        <Wrapper variant="success">
        </Wrapper>
        </>

    )
  }

  return desktopOverlay()

}
NewPhotoMarker.defaultProps = {
  onClick: null,
};

NewPhotoMarker.propTypes = {
  onClick: PropTypes.func,
};

export default NewPhotoMarker;
