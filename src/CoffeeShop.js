import React from 'react';
class CoffeeShop extends React.Component {

    render() {
        return (
          //ensure roles and tab index are correct for ARIA and a11y compliance
          // lots of help from the Tyler McGinnis course here!
            <li role="button" className="box" tabIndex="0"
              onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker)} onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}>
              {this.props.data.shopName}</li>
            )}};

              export default CoffeeShop;
