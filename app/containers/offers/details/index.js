import React, { PureComponent } from 'react';
import { TouchableHighlight, ScrollView, View, Image, Text } from 'react-native';
import I18n from 'react-native-i18n';
import Toast from '@remobile/react-native-toast';
import { graphql } from 'react-apollo';
import has from 'lodash/has';
import { formatCurrency } from 'app/utils/currency';
import query from './query';
import Style from './style';

export class Details extends PureComponent {
  state = { balance: 0 };

  async componentWillMount() {
    this.props.navigator.setTitle({ title: I18n.t('offers.details.title') });

    this.setState({ balance: this.props.balance });
  }

  static formatCurrency(value) {
    return formatCurrency({ value });
  }

  purchase = async () => {
    try {
      const response = await this.props.mutate({ variables: { offerId: this.props.id } });

      if(has(response, 'data.purchase')) {
        const { data: { purchase } } = response;

        if(purchase.errorMessage) {
          Toast.showLongCenter(I18n.t('offers.details.errorMessage', { reason: purchase.errorMessage }));
        }

        if(purchase.success === true) {
          this.setState({ balance: purchase.customer.balance });
          Toast.showLongCenter(I18n.t('offers.details.successMessage'));
        }
      }
    } catch(error) {
      Toast.showLongCenter(I18n.t('offers.details.errorMessage'));
    }
  }

  render() {
    const { price, product: { name, description, image } } = this.props;

    return (
      <ScrollView contentContainerStyle={Style.container}>
        <View>
          <Image source={{ uri: image }} style={Style.headerImage} />
          <Text style={Style.headerNameLabel}>{name}</Text>
          <Text style={Style.headerPriceLabel}>{Details.formatCurrency(price)}</Text>
        </View>

        <View style={Style.contentContainer}>
          <Text style={Style.contentDescriptionLabel}>{description}</Text>
        </View>

        <View style={Style.buttonContainer}>
          <TouchableHighlight
            onPress={this.purchase}
            style={Style.button}
            underlayColor="#962fbf"
          >
            <Text style={Style.buttonLabel}>
              {I18n.t('offers.details.purchase')}
            </Text>
          </TouchableHighlight>

          <Text style={Style.balanceLabel}>
            {
              I18n.t('offers.details.currentBalance', {
                value: Details.formatCurrency(this.state.balance)
              }
            )}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default graphql(query)(Details);
