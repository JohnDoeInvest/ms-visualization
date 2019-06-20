import { h, Component } from 'preact';
import jsPDF from 'jspdf';

class PDFExporter extends Component {
    handleExport = (event) => {
        try {
            event.preventDefault();
    
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: 'a4'
            });
    
            const svgElement = document.getElementById("flow-chart").querySelector('.svg-container');
            const serializer = new XMLSerializer();
            const svgAsText = serializer.serializeToString(svgElement);
            
            doc.addSVG(svgAsText, 20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);
            doc.save('MS-Visualization.pdf');
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    render(props, state) {
        return (
            <button class="ui icon primary basic button" onClick={this.handleExport}>
                <i class="file pdf icon"></i>
                Export PDF
            </button>
        )
    }
}

export default PDFExporter;
