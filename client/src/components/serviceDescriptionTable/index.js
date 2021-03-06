import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { connect } from 'preact-redux'
import * as serviceDescriptionActions from '../../actions/serviceDescription.action'
import { EventManager, EventNames } from '../../lib/d3/types/event.types'
import style from './style.css'

class ServiceDescriptionTable extends Component {
  isHighlight (index) {
    return (
      this.props.selectedServiceDescriptionIndex !== undefined &&
            this.props.selectedServiceDescriptionIndex === index
    )
  }

    handleSelectServiceDescription = index => () => {
      const selectedIdx = this.props.selectedServiceDescriptionIndex !== index ? index : undefined
      this.props.selectServiceDescription(selectedIdx)

      const serviceDescription = (selectedIdx !== undefined)
        ? this.props.selectedServiceDescriptions[index]
        : undefined
      EventManager.dispatch.highlight.call(EventNames.Highlight, null, serviceDescription)
    }

    render (props, state) {
      if (props.selectedServiceDescriptions.length === 0) {
        return null
      }
      return (
        <div className="full-width">
          <h2 className="ui header">Service Descriptions</h2>
          <table className="ui selectable fixed table">
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
                  className={`is-hovered ${this.isHighlight(i) ? style.active : style.inactive}`}
                >
                  <td className="is-capitalize">{serviceDescription.name}</td>
                  <td>{serviceDescription.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
}

const mapStateToProps = state => ({
  selectedServiceDescriptions: state.serviceDescription.selectedServiceDescriptions,
  selectedServiceDescriptionIndex: state.serviceDescription.selectedServiceDescriptionIndex
})

const mapDispatchToProps = {
  selectServiceDescription: serviceDescriptionActions.selectServiceDescription
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceDescriptionTable)
