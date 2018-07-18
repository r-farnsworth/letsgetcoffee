import React from 'react';
class CoffeeShop extends React.Component {

    render() {
        return (
          //ensure roles and tab index are correct for ARIA and a11y compliance
          // lots of help from the Tyler McGinnis course here!
            <li
              role="button"
              tabIndex="0"
              // ensure event handlers are passed in as props, per the rubric
              // binding needs to happen else the app won't behave correctly
              // (and this only took me days to work out... sigh...)
              onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker)} onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}>
              {this.props.data.shopName}</li>
            )}};

              export default CoffeeShop;
