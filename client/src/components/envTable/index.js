import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import * as serviceDescriptionActions from '../../actions/serviceDescription.action';

import style from './style.css';

class ENVTable extends Component {
    constructor(props) {
        super(props);
    }

    isHighlight(env) {
        const serviceDescription = this.props.selectedServiceDescriptions[this.props.selectedServiceDescriptionIndex];
        
        if (serviceDescription) {
            return serviceDescription.envVars[env.name];
        }

        return false;
    }

    getEnvs() {
        let envs = [];
        let envMap = new Map();

        for (const serviceDescription of this.props.selectedServiceDescriptions) {
            const { envVars } = serviceDescription;
            for (const key of Object.keys(envVars)) {
                if (!envMap.has(key)) {
                    envMap.set(key, envVars[key]);
                }
            }
        }

        for (const [key, value] of envMap) {
            envs.push({
                name: key,
                ...value
            });
        }

        return envs;
    }

    render(props, state) {
        const envs = this.getEnvs();

        return (
            <table class="ui selectable celled table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {envs.map((env, i) => (
                        <tr class={this.isHighlight(env) ? style.active : style.inactive} key={i}>
                            <td>{env.name}</td>
                            <td>{env.description}</td>
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

export default connect(
    mapStateToProps,
    undefined
)(ENVTable);