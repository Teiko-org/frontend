import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = ({ value, onChange }) => {
  const phoneStyle = {
    containerStyle: {
      width: '100%',
    },
    inputStyle: {
      width: '100%',
      borderRadius: '12px',
      height: '44px',
      border: 'none',
      paddingLeft: '16px',
      paddingRight: '16px',
      fontSize: '14px',
    },
    buttonStyle: {
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '12px 0 0 12px',
    },
  };

  return (
    <div>
      <PhoneInput
        country={'br'}
        value={value}
        onChange={onChange}
        enableSearch={true}
        inputProps={{
          name: 'phone',
          required: true,
          autoFocus: true,
        }}
        masks={{ br: '(..) .....-....' }}
        placeholder="(DDD) (XX) XXXXX-XXXX"
        {...phoneStyle}
      />
    </div>
  );
};

export default PhoneNumberInput;