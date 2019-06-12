import { h, Component } from 'preact';

class PDFExporter extends Component {
    handleExport = (event) => {
        event.preventDefault();
    }

    render(props, state) {
        return (
            <a href="#" onClick={this.handleExport}>Export PDF</a>
        )
    }
}

export default PDFExporter;
