import { h, Component } from 'preact';

class Printer extends Component {
    handlePrint = () => {
        window.print();
    }

    render() {
        return (
            <button class="ui icon primary basic button" onClick={this.handlePrint}>
                <i class="print icon"></i>
                Print
            </button>
        );
    }
}

export default Printer;
