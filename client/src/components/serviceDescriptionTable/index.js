import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import * as serviceDescriptionActions from '../../actions/serviceDescription.action';

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
        return (
            <table class="ui selectable celled table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {props.selectedServiceDescriptions.map((serviceDescription, i) => (
                        <tr
                            key={i}
                            onClick={this.handleSelectServiceDescription(i)}
                        >
                            <td>{serviceDescription.name}</td>
                            <td>{serviceDescription.description}</td>
                            <td class={this.isHighlight(i) ? 'positive' : 'warning'}>
                                {this.isHighlight(i) ? 'Selected' : ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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