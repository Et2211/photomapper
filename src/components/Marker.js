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
              backgroundColor: '#f2f2f2',
              color: '#000',
              borderRadius: 3,
              border: '1px solid #000',
              ...props.style,
              width: '400px'
            }}
          >
            <div className='row image-popUp'>
              <div className='col-4'>
                <h3 className='text-uppercase text-center'>{title}</h3>
              </div>

              <div className='col-8'>
                <div className='image-container'>
                  <img src={process.env.PUBLIC_URL + "/images/" + photo} className='float-end h-100 w-100'></img>
                </div>
              </div>
            </div>
            
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
