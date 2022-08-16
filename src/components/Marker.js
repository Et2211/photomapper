import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';

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
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`;

const Marker = ({ text, onClick, photo, title }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  console.log(process.env.PUBLIC_URL + "/images/IMG_20220725_203539.jpg")

return(

  
  <>
      <Overlay target={target.current} show={show} placement="right">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              position: 'absolute',
              backgroundColor: '#fff',
              padding: '2px 10px',
              color: '#000',
              borderRadius: 3,
              border: '1px solid #000',
              ...props.style,
            }}
          >
            {title}
            <img src={process.env.PUBLIC_URL + "/images/" + photo} height="200px" width={"200px"}></img>
            
          </div>
        )}
      </Overlay>


  <Wrapper
    alt={text}
    variant="danger" ref={target} onClick={() => setShow(!show)}
    />
</>
);
}
Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker;
