/* eslint-disable */
import { h, Component } from 'preact';
import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/monokai';
import style from '../style';

class Editor extends Component {
    editor = null
    error = null

    componentDidMount() {
        this.editor = ace.edit('editor', {
            enableBasicAutocompletion: true,
        });
        this.editor.getSession().setMode('ace/mode/json')
        this.editor.setTheme('ace/theme/monokai')
        this.editor.$blockScrolling = Infinity
    }

    componentDidUpdate() {
        if (this.editor) {
            this.editor.setValue(this.props.value || '')
        }
    }

    handleVisualize = () => {
        try {
            const jsonStr = this.editor.getSession().getValue()
            const jsonObj = JSON.parse(jsonStr)
            this.props.onData(jsonObj)
            this.setState({ error: null })
        } catch (err) {
            console.error(err);
            this.setState({ error: 'Invlaid input' })
        }
    }

    render(props, state) {
    	return (
            <div class={style.container}>
                <div id="editor" class={style.editor} />
                <button
                    class="ui button primary"
                    style={{marginTop: '16px'}}
                    onClick={this.handleVisualize}
                >
                    <i class="chart area icon" />
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

