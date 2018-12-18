/* eslint-disable */
import { h, Component } from 'preact';
import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/monokai';
import style from './style';

class Editor extends Component {
    editor = null;
    error = null;

    componentDidMount() {
        this.editor = ace.edit('editor', {
            enableBasicAutocompletion: true
        });
        this.editor.getSession().setMode('ace/mode/json');
        this.editor.setTheme('ace/theme/monokai');
    }

    handleVisualize = () => {
        try {
            const jsonStr = this.editor.getSession().getValue();
            const jsonObj = JSON.parse(jsonStr);
            this.props.onData(jsonObj);
            this.setState({ error: null });
        } catch (err) {
            console.error(err);
            this.setState({ error: 'Invlaid input' });
        }
    }

    render(props, state) {
    	return (
            <div class={style.container}>
                <div id="editor" class={style.editor} />
                <button
                    class={style.btn}
                    style={{marginTop: '16px'}}
                    onClick={this.handleVisualize}
                >
                    Visualize
                </button>
                {state.error && (
                    <p class={style.error}>{state.error}</p>
                )}
            </div>
    	);
    }
}

export default Editor;

