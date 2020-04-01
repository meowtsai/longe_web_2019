import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import isEmpty from '../../../../validation/is-empty';

const GeneralForm = ({ register, errors, question_types, watch }) => {
  const fileInfo = watch('file01');
  // console.log('fileInfo', fileInfo);
  return (
    <div>
      <div className='form-group'>
        <label className='small text-primary'>問題類別</label>
        <select
          className={classnames('form-control form-control-md', {
            'is-invalid': errors.question_type
          })}
          name='question_type'
          ref={register({ required: true })}>
          <option value=''>請選擇問題類別</option>
          {Object.getOwnPropertyNames(question_types).map(type => (
            <option key={`qtype-${type}`} value={type}>
              {question_types[type]}
            </option>
          ))}
        </select>
      </div>
      <div className='form-group'>
        <label className='small text-primary'>問題描述</label>
        <textarea
          rows='6'
          className={classnames('form-control form-control-md', {
            'is-invalid': errors.content
          })}
          name='content'
          ref={register({ required: true, minLength: 5 })}
        />
        <small id='accountHelp' className='form-text text-muted'>
          請詳細說明問題以加速處理流程
        </small>
      </div>

      <div className='form-group'>
        <label className='small text-primary'>附件</label>
        <div className='custom-file mb-5'>
          <input
            type='file'
            name='file01'
            className={classnames('custom-file-input', {
              'is-invalid': errors.file01
            })}
            ref={register({
              validate: value => fileInfo.length <= 6
            })}
            accept='image/gif, image/jpeg,image/png'
            multiple
          />
          <label
            className='custom-file-label'
            htmlFor='customFile'
            data-browse='瀏覽'>
            {!isEmpty(fileInfo)
              ? `已選取${fileInfo.length}個`
              : '附件(最多6個)'}
          </label>
          {fileInfo && (
            <small className='form-text text-muted'>
              <ul style={{ paddingLeft: '15px' }}>
                {Object.keys(fileInfo).map(fileInfoKey => (
                  <li style={{ listStyleType: 'square' }} key={fileInfoKey}>
                    {fileInfo[fileInfoKey].name}
                  </li>
                ))}
              </ul>
            </small>
          )}
          {errors.file01 && (
            <div className='invalid-feedback d-block'>附件最多6個</div>
          )}
        </div>
      </div>
    </div>
  );
};

GeneralForm.propTypes = {
  question_types: PropTypes.object.isRequired
};

export default GeneralForm;
