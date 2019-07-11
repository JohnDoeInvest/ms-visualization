import { h, Component } from 'preact' // eslint-disable-line no-unused-vars

class Printer extends Component {
    handlePrint = () => {
      window.print()
    }

    render () {
      return (
        <button className="ui icon primary basic button" onClick={this.handlePrint}>
          <i className="print icon" />
                Print
        </button>
      )
    }
}

export default Printer
