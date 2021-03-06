import React, {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { postComment } from '../../../functions/api';
import styled from 'styled-components';
import { IComment } from '../../../types';
import gsap from 'gsap';
interface Props {
    setComments: Dispatch<SetStateAction<IComment[] | undefined>>;
    setMadeNewComment: React.Dispatch<React.SetStateAction<boolean>>;
}
export const StyledCommentForm = styled.form`
    display: grid;
    gap: 1em;
    border: 2px solid ${(props) => props.theme.stroke};
    padding: 2em;
    color: ${(props) => props.theme.paragraph};
    h2 {
        padding-bottom: 1em;
    }
    button[type='submit'] {
        position: relative;
        background-color: ${(props) => props.theme.buttonbg};
        color: ${(props) => props.theme.paragraph};
        border: 1px solid ${(props) => props.theme.stroke};
        border-radius: 1em;
        padding: 0.2em;
        span {
            display: inline-block;
        }
    }
`;

export const CheckIcon = styled.span`
    position: absolute;
    transform: translate(-10px, -1px);
    color: #009c00;
    opacity: 0;
`;
export const StyledInputContainer = styled.div`
    display: grid;
    gap: 0.4em;

    input,
    textarea {
        border: 1px solid ${(props) => props.theme.stroke};
    }
    input[type='text'] {
        padding: 0.4em;
        max-width: 250px;
    }
    textarea {
        resize: none;
    }
`;

export const CommentForm: React.FC<Props> = ({
    setComments,
    setMadeNewComment,
}) => {
    const { id } = useParams<{ id: string }>();
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');
    const { current: tl } = useRef(gsap.timeline({ paused: true }));
    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        if (e.target.name === 'author') {
            setAuthor(e.target.value);
        } else if (e.target.name === 'text') {
            setText(e.target.value);
        }
    }

    function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!text || !author) {
            return;
        }
        postComment(id, author, text).then((json: IComment) => {
            if (json._id) {
                tl.restart();
                setTimeout(() => {
                    tl.reverse();
                }, 1000);
                setTimeout(() => {
                    setMadeNewComment(true);
                }, 1500);

                setComments((comments) => {
                    if (comments) {
                        const temp = [...comments];
                        temp.unshift(json);
                        return temp;
                    } else {
                        return [json];
                    }
                });
            }
            setText('');
            setAuthor('');
        });
    }

    useEffect(() => {
        tl.to('.submit', {
            x: -20,
            duration: 1,
            ease: 'power2',
        }).to(
            '.check',
            {
                opacity: 1,
                duration: 1,
                ease: 'power1',
            },
            '-=0.5'
        );
    }, [tl]);

    return (
        <StyledCommentForm onSubmit={handleSubmit}>
            <h2 className="test">Leave a comment </h2>
            <StyledInputContainer>
                <label htmlFor="author">Name:</label>
                <input
                    type="text"
                    name="author"
                    value={author}
                    onChange={handleChange}
                />
            </StyledInputContainer>
            <StyledInputContainer>
                <label htmlFor="text">Comment:</label>
                <textarea
                    name="text"
                    id=""
                    value={text}
                    onChange={handleChange}
                    cols={30}
                    rows={10}
                ></textarea>
            </StyledInputContainer>
            <button type="submit">
                <span className="submit">Submit</span>{' '}
                <CheckIcon className="check">✔</CheckIcon>
            </button>
        </StyledCommentForm>
    );
};
