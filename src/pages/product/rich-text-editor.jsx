import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class RichTextEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }
    static propTypes = {
        detail: PropTypes.string
    }
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    getDetail = () =>  draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
       
    
    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://106.54.249.182:5000/manage/img/upload');
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const url = response.data.url;
                    delete response.data.url;
                    response.data.link = url;
                    resolve(response);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }
    componentWillMount() {
        const detail = this.props.detail;
        if (detail) {
            const contentBlock = htmlToDraft(detail);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ editorState });
        }
    }
    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorStyle={{ height: 200, border: '1px solid black', paddingLeft: 10 }}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{

                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
                {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                    /> */}
            </div>
        );
    }
}
export default RichTextEditor