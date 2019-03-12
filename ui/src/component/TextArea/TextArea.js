import React, { Component } from 'react';
import './TextArea.css';

class TextArea extends Component {
  static evaluateGradient(color1, color2, percentage) {
    const color1Weight = percentage;
    const color2Weight = 1 - percentage;
    return `rgba(${[
      color1[0] * color1Weight + color2[0] * color2Weight,
      color1[1] * color1Weight + color2[1] * color2Weight,
      color1[2] * color1Weight + color2[2] * color2Weight,
      color1[3] * color1Weight + color2[3] * color2Weight,
    ].join(',')})`;
  }

  constructor(props) {
    super(props);
    this.state = { value: '', sentimentText: [] };
    this.getSentiment = this.getSentiment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.syncScroll = this.syncScroll.bind(this);
  }

  getSentiment(text) {
    fetch('/api/sentiment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        this.setState(prevState => (
          {
            value: prevState.value,
            sentimentText: response,
          }));
        this.syncScroll();
      })
      .catch();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.getSentiment(event.target.value);
  }

  syncScroll() {
    const masterScrollTop = this.scrollSyncMaster.scrollTop;
    this.scrollSyncTarget.scrollTop = masterScrollTop;
  }

  render() {
    const { ...state } = this.state;
    return (
      <div className="TextArea">
        <div className="Background" ref={(c) => { this.scrollSyncTarget = c; }}>
          <div className="Highlights">
            {
                state.sentimentText.map(paragraph => (
                  <div className="ParDiv">
                    {
                        paragraph.map((sentence) => {
                          let color1; let
                            color2;
                          if (sentence.polarity.compound < 0) {
                            color1 = [255, 0, 0, 1];
                            color2 = [0, 0, 0, 0];
                          } else {
                            color1 = [0, 255, 0, 1];
                            color2 = [0, 0, 0, 0];
                          }
                          return (
                            <span
                              className="SentenceSpan"
                              style={
                              {
                                backgroundColor: TextArea.evaluateGradient(
                                  color1, color2, Math.abs(sentence.polarity.compound),
                                ),
                              }
                            }
                            >
                              {sentence.sentence}
                            </span>
                          );
                        })
                      }
                    <br />
                  </div>
                ))
              }
            {state.value[state.value.length - 1] === '\n'
                && <br />
              }
          </div>
        </div>
        <textarea
          className="Editable"
          ref={(c) => { this.scrollSyncMaster = c; }}
          onChange={this.handleChange}
          onScroll={this.syncScroll}
        />
      </div>
    );
  }
}

export default TextArea;
