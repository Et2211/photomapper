import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import useWindowDimensions from './../hooks/useWindowDimensions'




const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: pointer;
  &:hover {
    z-index: 1;
  }
`;
function useOutsideAlerter(ref, setShow) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const Marker = ({ text, onClick, photo, photoName, username, date, i }) => {
  const { height, width } = useWindowDimensions();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fullscreen, setFullscreen] = useState(true);


  useEffect(()=>{
  }, [])
  

  const popover = (
    <Popover id="popover-photo">
      <Popover.Header as="h1">{photoName}</Popover.Header>
      <Popover.Body>
        <p>Uploaded by {username}</p>
        <div className='image-container'>
          <img src={photo} className='w-100'></img>
        </div>
      </Popover.Body>
    </Popover>
  );

  const desktopOverlay = () => {
    return(
      <OverlayTrigger trigger="click" placement="top" overlay={popover} rootClose>
        <Wrapper variant="success"></Wrapper>
      </OverlayTrigger>
    )
  }

  const mobileOverlay = () => {
    return(
      <>

      <Wrapper variant="primary" onClick={handleShow}>
      </Wrapper>

      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Uploaded by {username}</p>
          <div className='image-container'>
            <img src={photo} className='w-100'></img>
          </div>
        </Modal.Body>

      </Modal>
      </>
    )
  }

  if (width > 768) {
    return desktopOverlay()
  }else {
    return mobileOverlay()
  }  

}
Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
};

export default Marker;
