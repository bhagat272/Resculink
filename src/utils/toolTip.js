import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import Colors from '../theme/colors';

const ToolTip = props => {
  return (
    <Tooltip
      backgroundColor="transparent"
      tooltipStyle={styles.toolTipStyle}
      contentStyle={[
        styles.tool_view,
        {
          top: props.top ? props.top : 0,
          left: props.left ? props.left : 0,
          width: props.width ? props.width : 90,
          height:props.height ? props.height : 100,
          borderRadius: props.borderRadius ? props.borderRadius : 7,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : Colors.primary.WHITE,
            elevation:3
        },
      ]}
      arrowSize={styles.arrow_Size}
      isVisible={props.isVisible}
      content={props.content}
      placement="top"
      onClose={props.onClose}>
      <Text style={styles.toolTipText}>.</Text>
    </Tooltip>
  );
};

export default ToolTip;

const styles = StyleSheet.create({
  tool_view: {
    position: 'absolute',
   
  },
  // toolTipStyle: {
  //   marginLeft: '0%',
  //   marginTop: '0%',
  // },
  toolTipText: {
    color: 'transparent',
  },
  arrow_Size: {
    height: 0,
    width: 0,
  },
});
