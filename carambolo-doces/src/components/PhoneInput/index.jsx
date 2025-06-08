import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = React.forwardRef(({ value, onChange }, ref) => {
  const phoneStyle = {
    containerStyle: {
      width: '100%',
    },
    inputStyle: {
      width: '100%',
      borderRadius: '8px',
      height: '40px',
      border: '1px solid #ccc',
    },
    buttonStyle: {
      backgroundColor: '#f0f0f0',
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
          ref,
        }}
        masks={{ br: '(..) .....-....' }}
        placeholder="(DDD) (XX) XXXXX-XXXX"
        {...phoneStyle}
      />
    </div>
  );
});

export default PhoneNumberInput;