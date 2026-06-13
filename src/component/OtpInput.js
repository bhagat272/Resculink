import React, {useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const OtpInput = ({value, onChange, length = 6}) => {
  const inputRef = useRef(null);

  const handleChange = text => {
    // allow only numbers
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    onChange(cleaned);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}>
      <View style={styles.container}>
        {/* OTP BOXES */}
        {Array.from({length}).map((_, i) => (
          <View key={i} style={styles.box}>
            <Text style={styles.text}>{value[i] || ''}</Text>
          </View>
        ))}

        {/* HIDDEN INPUT */}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChange}
          keyboardType="number-pad"
          textContentType="oneTimeCode" // iOS auto OTP
          autoComplete="sms-otp" // Android
          maxLength={length}
          style={styles.hiddenInput}
        />
      </View>
    </TouchableOpacity>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
 