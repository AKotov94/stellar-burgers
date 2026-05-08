import styles from './constructor-page.module.css';

import {
  BurgerIngredients,
  Modal,
  BurgerConstructor,
  IngredientDetails
} from '@components';
import { FC } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const ConstructorPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isModalOpen = Boolean(id);

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  return (
    <>
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </div>
      </main>

      {isModalOpen && (
        <Modal
          title='Подробная информация об ингредиенте'
          onClose={handleClose}
        >
          <IngredientDetails />
        </Modal>
      )}
    </>
  );
};
