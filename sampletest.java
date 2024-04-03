import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.JmsException;

import static org.mockito.Mockito.*;

public class JmsproducerTest {

    @Mock
    private JmsTemplate mockJmsTemplate;

    @InjectMocks
    private Jmsproducer jmsproducer;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSendOSM() {
        // Mock data
        AttachemetRecordDB attachmentRecordDb = new AttachemetRecordDB();
        attachmentRecordDb.setMessage("Test message");
        Action action = new Action(); // Assuming Action is a class or enum used in your code

        // Mock behavior
        doNothing().when(mockJmsTemplate).convertAndSend(anyString(), anyString());

        // Call the method under test
        jmsproducer.sendOSM(attachmentRecordDb, action);

        // Verify that the convertAndSend method was called with the correct arguments
        verify(mockJmsTemplate, times(1)).convertAndSend(anyString(), anyString());
    }
}
