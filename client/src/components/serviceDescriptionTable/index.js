import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import * as serviceDescriptionActions from '../../actions/serviceDescription.action';
import style from './style.css';

class ServiceDescriptionTable extends Component {
    constructor(props) {
        super(props);
    }

    isHighlight(index) {
        return (
            this.props.selectedServiceDescriptionIndex !== undefined
            && this.props.selectedServiceDescriptionIndex === index
        );
    }

    handleSelectServiceDescription = (index) => () => {
        this.props.selectServiceDescription(index);
    }

    render(props, state) {
        if (props.selectedServiceDescriptions.length === 0) {
            return null;
        }
        return (
            <div class="page-break full-width">
                <h2 class="ui header">Service Descriptions</h2>
                <table class="ui selectable celled table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.selectedServiceDescriptions.map((serviceDescription, i) => (
                            <tr
                                key={i}
                                onClick={this.handleSelectServiceDescription(i)}
                                class={this.isHighlight(i) ? style.active : style.inactive}
                            >
                                <td>{serviceDescription.name}</td>
                                <td>{serviceDescription.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedServiceDescriptions: state.serviceDescription.selectedServiceDescriptions,
    selectedServiceDescriptionIndex: state.serviceDescription.selectedServiceDescriptionIndex,
});

const mapDispatchToProps = {
    selectServiceDescription: serviceDescriptionActions.selectServiceDescription
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ServiceDescriptionTable);