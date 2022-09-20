import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

const Marker = ({ text, onClick, photo, photoName, username, date }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  useOutsideAlerter(target, setShow);

  useEffect(()=>{
    document.addEventListener('click', setShow(false))
  }, [])

return(

  
  <>
  <Wrapper
    variant="danger" ref={target} onClick={() => setShow(!show)}
    />
      <Overlay target={target.current} show={show} placement="right" rootClose={true} rootCloseEvent={'click'}>
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
                <div className='row'>
                  <div className='col-12'>
                    <h3 className='text-uppercase text-center'>{photoName}</h3>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <h6>{date}</h6>
                  </div>
                </div>




                <p>Uploaded by {username}</p>
              </div>

              <div className='col-8'>
                <div className='image-container'>
                  <img src={photo} className='float-end h-100 w-100'></img>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </Overlay>


</>
);
}
Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
};

export default Marker;
