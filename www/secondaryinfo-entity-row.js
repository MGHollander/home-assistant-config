/**
 * secondaryinfo-entity-row
 *
 * Custom entity row for Home Assistant, providing additional types of data to be displayed in the secondary info sections of the Lovelace Entities card.
 *
 * @version master (2021-03-18)
 * @see https://github.com/custom-cards/secondaryinfo-entity-row
 */

customElements.whenDefined('card-tools').then(() => {

    class SecondaryInfoEntityRow extends cardTools.LitElement {
        version() { return "0.4"; }

        render() {
            return cardTools.LitHtml`
                ${this._wrappedElement}
            `;
        }

        setConfig(config) {
            cardTools.checkVersion(2.0);
            this._config = config;
            this._wrappedElement = this._createElement(config);
            this.requestUpdate();
        }

        set hass(hass) {
            this._hass = hass;
            this._stateObj = this._config.entity in hass.states ? hass.states[this._config.entity] : null;
            this._updateElement(this._wrappedElement, hass);
        }

        _createElement(config) {
            // Override the custom row type in order to create the 'standard' row for this entity
            let defaultRowConfig = Object.assign({}, config);
            delete defaultRowConfig.type;
            const element = cardTools.createEntityRow(defaultRowConfig);
            return element;
        }

        async _updateElement(wrappedElement, hass) {
            if (!wrappedElement) return;

            this._wrappedElement.hass = hass;
            await this._wrappedElement.updateComplete;
            await this._wrappedElement.shadowRoot.querySelector("hui-generic-entity-row");
            let secondaryInfoDiv = this._wrappedElement.shadowRoot.querySelector("hui-generic-entity-row").shadowRoot.querySelector(".secondary");
            if (secondaryInfoDiv && this._config.secondary_info) {
                let text = window.cardTools.parseTemplate(this._config.secondary_info, {entity: this._config.entity});
                secondaryInfoDiv.innerHTML = text;
            }
        }
    }
    customElements.define('secondaryinfo-entity-row', SecondaryInfoEntityRow);

});

setTimeout(() => {
    if (customElements.get('card-tools')) return;
    customElements.define('secondaryinfo-entity-row', class extends HTMLElement {
        setConfig() {
            throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");
        }
    });
}, 2000);