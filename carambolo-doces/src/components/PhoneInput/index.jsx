import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './PhoneInput.css';

const PhoneNumberInput = React.forwardRef(({ value, onChange, className = '', ...props }, ref) => {
  const phoneStyle = {
    containerStyle: {
      width: '100%',
    },
    inputStyle: {
      width: '100%',
      borderRadius: '12px',
      height: '44px',
      border: 'none',
      paddingLeft: '8px',
      paddingRight: '16px',
      fontSize: '14px',
      backgroundColor: 'white',
    },
    buttonStyle: {
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '12px 0 0 12px',
      padding: '0 8px',
      minWidth: '70px',
      height: '44px',
    },
    dropdownStyle: {
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <div className={`phone-input-container ${className}`}>
      <PhoneInput
        ref={ref}
        country={'br'}
        value={value}
        onChange={onChange}
        enableSearch={true}
        inputProps={{
          name: 'phone',
          required: true,
          ...props
        }}
        masks={{ br: '(..) .....-....' }}
        placeholder="(XX) XXXXX-XXXX"
        disableDropdown={false}
        disableCountryCode={false}
        countryCodeEditable={false}
        preferredCountries={['br']}
        onlyCountries={['br']}
        {...phoneStyle}
      />
    </div>
  );
});

export default PhoneNumberInput;