---
title: How to integrate Rails and Devise with React, Redux Form and Semantic UI
layout: post
tags:
- rails
- react
- redux
- semantic
---
{% image_tag src="/media/2017/organizations-new.png" width="572" %}

So I'm working on this pet project of mine where we use Rails, React, Redux, Redux Form and Semantic UI. Recently I had to tie everything up and create a sign up form for Devise. Here's how I did it in case you're in a similar situation. I saw some posts about "this and that" but I didn't found a go to solution. I hope it will save you some time.

Lets start with a form itself.

```
import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import { Field } from 'redux-form';
import FocusedTask, { FocusedTaskContent } from 'app/layouts/FocusedTask';
import SemanticInput from '../../../components/SemanticInput';

require('./OrganizationForm.scss');

const OrganizationForm = (props) => {
    const { error, handleSubmit, pristine, submitting } = props;
    return (
        <FocusedTask>
            <FocusedTaskContent>
                <Message attached header="Create a new organisation!"
                         content="Fill in the form to create an organization, you'll become an admin automatically."/>

                <Form onSubmit={handleSubmit} className="attached fluid segment">
                    {error && <strong>{error}</strong>}

                    <Form.Field>
                        <label>Organisation name</label>
                        <Field name="organization.name" component={SemanticInput} placeholder="Put a name here"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Subdomain</label>
                        <Field name="organization.slug" component={SemanticInput} placeholder="Your subdomain"/>
                    </Form.Field>
                    <Form.Field>
                        <label>E-mail</label>
                        <Field name="email" component={SemanticInput} placeholder="Your business e-mail"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <Field name="password" component={SemanticInput} placeholder="Make it at least 8 characters" type="password"/>
                    </Form.Field>
                    <Form.Field>
                        <label>First name</label>
                        <Field name="first_name" component={SemanticInput} placeholder="First name"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Last name</label>
                        <Field name="last_name" component={SemanticInput} placeholder="Last name"/>
                    </Form.Field>
                    <Form.Button primary disabled={pristine || submitting}>Create</Form.Button>
                </Form>
            </FocusedTaskContent>
        </FocusedTask>
    );
};

export default OrganizationForm;
```

The thing about the form - as you can see Fields are coming from Redux Form but for every I use `component={SemanticInput}` meaning that Redux Form will use this component class to render the input, it will pass the same props as given to the `Field` component.

You can think of Redux Form as a meta layer that manages state of the underlaying component at the same time providing some decent default implementation if you don't want to use your own one.

`SemanticInput` is quite simple - it uses `Input` from Semantic UI to render proper markup, plus error handling and some sugar for easier testing `data-field-name`

```
import React from 'react';
import { Input } from 'semantic-ui-react';
import FieldErrors from './FieldErrors';

const SemanticInput = (props) => {
    const { meta: { touched, error }, input } = props;
    return (
        <div data-field-name={input.name}>
            <Input onChange={(e, { value }) => input.onChange(value)} {...props}/>
            {touched && error && <FieldErrors errors={error}/>}
        </div>
    );
};

export default SemanticInput;
```

I saw somewhere someone trying to create and use this uber Semantic UI wrapper that would emit every component, but I like a simpler approach, if I need more components I will created additional files and name the appropriately.

You may wonder what's `FieldErrors`:

```
import React from 'react';
import { Message } from 'semantic-ui-react';

const FieldErrors = (props) => {
    const { errors } = props;
    return (
        <Message error visible>
            <Message.List>
                {errors.map((error) => (<Message.Item key={error} content={error}/>))}
            </Message.List>
        </Message>);
};

export default FieldErrors;
```

Again simple wrapper for Semantic components.

Now you probably wonder how form submission is handled? You might haven noticed that the form is getting `handleSubmit` in props, this is a special handler provided by Redux Form which then delegates to `onSubmit`, here's a component that wraps all together.

```
import { connect } from 'react-redux';
import prepareModelForRails from 'app/utils/prepareModelForRails';
import railsErrorsForReduxForm from 'app/utils/railsErrorsForReduxForm';
import OrganizationForm from './OrganizationForm';
import React from 'react';
import { compose, withApollo } from 'react-apollo';
import { reduxForm, SubmissionError } from 'redux-form';

const NewOrganizationPage = compose(
    withApollo,
    connect(
        (state) => ({}),
        (dispatch, ownProps) => {
            return {
                onSubmit: (values) => {
                    return fetch('/users.json', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user: prepareModelForRails(values, ["organization"])
                        }),
                        credentials: 'same-origin'
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json.errors) {
                                throw new SubmissionError(railsErrorsForReduxForm(json.errors));
                            } else {
                                ownProps.client.resetStore();
                                window.location.assign(json.user.organization.url);
                            }
                        });
                }
            }
        }
    ),
    reduxForm({
        form: 'newOrganization'
    })
)(OrganizationForm);

export default NewOrganizationPage;
```

Now the trick is in `prepareModelForRails` and `railsErrorsForReduxForm` - as you can see `onSubmit` will get inputs from the form and call Devise's `users` controller. In case there are any errors it will throw `SubmissionError` which is a special class handled by Redux Form.

`prepareModelForRails` helps me handle nested models (in case of my form creating first user means also creating an organization/tenant):

```js
import reduce from 'lodash/reduce'
import isArray from 'lodash/isArray'
import indexOf from 'lodash/indexOf'

export default function prepareModelForRails(model, force = []) {
    if (typeof model !== 'object') {
        return model
    } else {
        if (isArray(model)) {
            return model.map( m => prepareModelForRails(m, force) )
        } else {
            return reduce(model, (result, value, key) => {
                if (isArray(value) || indexOf(force, key) !== -1) {
                    result[`${key}_attributes`] = prepareModelForRails(value, force)
                } else {
                    result[key] = prepareModelForRails(value, force)
                }
                return result
            }, {})
        }
    }
};
```

`railsErrorsForReduxForm` will prepare proper model for Redux Form, the trick here is that it will translate Rails errors:

```js
{
    "organization.name": [
        "error"
    ]
}
```

Into Redux Form format:

```js
{
    organization: {
        name: ['error']
    }
}
```

And that basically what's needed!

In case you want to see the whole code in action check out [utils](https://github.com/pawelniewie/zen2/tree/aa66e728f20df5dd684b6fa4416396f6fff1229f/app/javascript/packs/client/utils) and [organizations](https://github.com/pawelniewie/zen2/tree/aa66e728f20df5dd684b6fa4416396f6fff1229f/app/javascript/packs/client/pages/organizations/new) folders in my project.

If anything is not clear ask me on [twitter](https://twitter.com/devonsteroids)

{% include newsletter.html %}

