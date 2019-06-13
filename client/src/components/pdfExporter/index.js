import { h, Component } from 'preact';
import jsPDF from 'jspdf';
import style from './style';

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
            <div class={style['pdf-container']}>
                <a href="#" onClick={this.handleExport}>Export PDF</a>
            </div>
        )
    }
}

export default PDFExporter;
